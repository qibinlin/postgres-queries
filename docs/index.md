---
layout: default
title: "Documentation"
---
# postgres-queries

Utility to generate and execute postgresql queries with ease.

## Install

`npm install --save postgres-queries`

## Introduction
Creating query and executing them are two separate concerns. And thus postgres-queries is divided in two parts:
- [The Pool](pool), that allows to connect to the postgres database and execute query.
- [The query builders](queryBuilder.html) (insertOne, selectOne, etc..) that allows to generate sql, and the corresponding parameters.


## Pool
Extend [node-pg-pool](https://github.com/brianc/node-pg-pool)
Allow to connect to postgresql and execute query
It adds:
- namedQuery
- a link helper to link a query builder to the client.

## Query Builder
The main idea behind the query builder is to be able to just give a configuration object:
- the name of a table
- its primary key(s)
- the columns we want to read
- the columns we want to write

And get a function asking for the query parameter:
- id
- data object

And returning queryData that can be directly passed to the `client.namedQuery` method.

Some builder even allows to create several builder at once.

For example the crud query builder give us builders to create queries for all basic crud operations:

```js
// configuring the crud builder for the user table
const userQueries = crud({
    table: 'user',
    primaryKey: 'id',
    writableCols: ['name', 'firstname'],
});

// give us a collection of functions to query the user table :

userQueries.selectOne(1);
// returns:
{
    sql: 'SELECT * FROM user WHERE id=$id;',
    parameters: {
        id: 1,
    },
    returnOne: true,
}

userQueries.select({ name: 'doe' });
// returns:
{
    sql: 'SELECT * FROM user WHERE name=$name ORDER BY id ASC;',
    parameters: { name: 'doe' },
}

userQueries.insertOne({ name: 'doe', firstname: 'john' });
// returns:
{
    sql: (
`INSERT INTO user (name, firstname)
VALUES ($name, $firstname)
RETURNING *;`
    ),
    parameters: {
        name: 'doe',
        firstname: 'john',
    },
    returnOne: true,
}

userQueries.batchInsert([
    { name: 'doe', firstname: 'john' },
    { name: 'doe', firstname: 'jane' },
]);
// returns:
{
    sql: (
`INSERT INTO user(name, firstname)
VALUES ('doe', 'john'), ('doe', 'jane')
RETURNING *;`
    ),
    parameters: {
        name1: 'doe',
        firstname1: 'john',
        name2: 'doe',
        firstname2: 'jane',
    },
}

userQueries.updateOne(1, { firstname: 'johnny' });
// returns:
{
    sql: (
`UPDATE user SET firstname=$firstname
WHERE id=$id RETURNING *;`
    ),
    parameters: {
        id: 1,
        firstname: 'johnny',
    }
}

userQueries.removeOne(1);
// returns:
{
    sql: `DELETE FROM user WHERE id=$id RETURNING *;`,
    parameters: { id: 1 },
    returnOne: true,
}
//

userQueries.batchRemove([1, 2]);
// returns:
{
    sql: (
`DELETE FROM user
WHERE id IN ($id1, $id2)
RETURNING *;`
    ),
    parameters: { id1: 1, id2: 2 },
}

userQueries.countAll();
// returns:
{
    sql: `SELECT COUNT(*) FROM user;`,
}
```
