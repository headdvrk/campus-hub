const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const ts = require('typescript');
const db = new DatabaseSync(':memory:');
db.exec(`CREATE TABLE favorites(id INTEGER PRIMARY KEY,title TEXT NOT NULL,body TEXT NOT NULL,isRead INTEGER NOT NULL DEFAULT 0 CHECK(isRead IN (0,1))); INSERT INTO favorites VALUES(7,'Old article','Old complete body',1);`);
let opens = 0;
const adapter = {
 execAsync: async sql => db.exec(sql),
 getAllAsync: async (sql, ...params) => db.prepare(sql).all(...params),
 getFirstAsync: async (sql, ...params) => db.prepare(sql).get(...params) ?? null,
 runAsync: async (sql, ...params) => db.prepare(sql).run(...params),
};
const code = ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../src/database/favorites.ts'),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const api = {};
vm.runInNewContext(code,{exports: api,require:name => {
 assert.equal(name,'expo-sqlite'); return {openDatabaseAsync: async () => {opens++; return adapter;}};
},Date,console});
(async()=>{
 const [a,b] = await Promise.all([api.getSavedPosts(),api.getSavedPost(7)]);
 assert.equal(opens,1); assert.equal(a.length,1); assert.equal(b.body,'Old complete body'); assert.equal(b.isRead,1); assert.equal(b.image,'');
 assert.equal(await api.savePost({id:8,title:'New article',body:'Full text',date:'2026-11-09',image:'https://example.test/image.png',link:'https://example.test/news'}),1);
 assert.equal((await api.getSavedPosts())[0].id,8);
 await api.markPostRead(8); await api.markPostRead(8); assert.equal((await api.getSavedPost(8)).isRead,1);
 assert.equal(await api.savePost({id:8,title:'Duplicate',body:'Duplicate'}),0);
 assert.equal((await api.getSavedPost(8)).title,'New article'); assert.equal((await api.getSavedPost(8)).isRead,1);
 await api.toggleRead(8); assert.equal((await api.getSavedPost(8)).isRead,0);
 await api.toggleRead(8); assert.equal((await api.getSavedPost(8)).isRead,1);
 await api.removeSaved(8); assert.equal(await api.getSavedPost(8),null); assert.equal((await api.getSavedPosts()).length,1);
 assert.equal((await api.getSavedPost(7)).body,'Old complete body');
 console.log('PASS: legacy migration preserves content/read state, concurrent init, metadata save, ordering, duplicate save, idempotent read, toggle, remove, missing record');
 db.close();
})().catch(e=>{console.error(e);process.exit(1)});
