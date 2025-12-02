/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_vWuO5MmaTw` ON `submissions` (`session_token`)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number2470773635",
    "max": null,
    "min": null,
    "name": "accuracy",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3981121951",
    "max": 0,
    "min": 0,
    "name": "class",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool4280950498",
    "name": "coding",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number3538568711",
    "max": null,
    "min": null,
    "name": "estimate",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool590033292",
    "name": "game",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool1019177437",
    "name": "instrument",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number2955803502",
    "max": null,
    "min": null,
    "name": "raw_wpm",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2219448813",
    "max": 0,
    "min": 0,
    "name": "session_token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number3109395960",
    "max": null,
    "min": null,
    "name": "time_ms",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool4139134450",
    "name": "touch",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3293145029",
    "max": 0,
    "min": 0,
    "name": "user_agent",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number2999174100",
    "max": null,
    "min": null,
    "name": "wpm",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // remove field
  collection.fields.removeById("number2470773635")

  // remove field
  collection.fields.removeById("text3981121951")

  // remove field
  collection.fields.removeById("bool4280950498")

  // remove field
  collection.fields.removeById("number3538568711")

  // remove field
  collection.fields.removeById("bool590033292")

  // remove field
  collection.fields.removeById("bool1019177437")

  // remove field
  collection.fields.removeById("number2955803502")

  // remove field
  collection.fields.removeById("text2219448813")

  // remove field
  collection.fields.removeById("number3109395960")

  // remove field
  collection.fields.removeById("bool4139134450")

  // remove field
  collection.fields.removeById("text3293145029")

  // remove field
  collection.fields.removeById("number2999174100")

  return app.save(collection)
})
