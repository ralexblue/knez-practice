require('dotenv').config()
const { expect } = require('chai')
const {TEST_DB_URL}=require('../src/config')
const supertest = require('supertest')
const shoppinglistservice = require('../src/shopping-list-service')
const knex = require('knex')





describe(`shopping list service object`, function() {
    let db
    let testlist=[
        {
            id:1,
            checked:false,
            name:'a',
            price:"13.25",
            category:'Main',
            date_added:new Date('2016-01-16 12:00:00')
        },
        {
            id:2,
            checked:false,
            name:'b',
            price:"11.99",
            category:'Lunch',
            date_added:new Date('2016-01-16 12:00:00')
        },
        {
            id:3,
            checked:false,
            name:'c',
            price:"18.55",
            category:'Breakfast',
            date_added:new Date('2016-01-16 12:00:00')
        },
        {
            id:4,
            checked:false,
            name:'d',
            price:"9.35",
            category:'Snack',
            date_added:new Date('2016-01-16 12:00:00')
        },
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection:TEST_DB_URL,
        })
    })
    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    before(()=>{
        return db
        .into('shopping_list')
        .insert(testlist)
    })
    after(()=>db.destroy())

    describe(`shoppinlistservice()`, () => {
        it(`resolves all articles from 'shopping_list' table`, () => {
            return shoppinglistservice.getAllShoppingList(db)
            .then(actual=>{
                expect(actual).to.eql(testlist)
            })
        })
        it(`has no data`,()=>{
            return shoppinglistservice.getAllShoppingList(db)
            .then(actual=>{
                expect(actual).to.eql([])
            })
        })
        it("addanitem inserts data",()=>{
            return shoppinglistservice.addanitem(db,testlist[1])
            .then(actual=>{
                expect(actual).to.eql(testlist[1])
            })
        })
        it('deletes an item',()=>{
            //const Id = 3
            shoppinglistservice.addanitem(db,testlist[3])
            .then(addeditem=>{
                let id=addeditem.id;
                shoppinglistservice.deleteanitem(db, id);
            })
            .then(() => shoppinglistservice.getAllShoppingList(db))
            .then(allList => {
            expect(allList).to.eql([])
            })

        })
    })
    describe('update db',()=>{
        it('updates and item',()=>{
            const idofitem=2;
            const newitem={
                //checked:false,
                name:'newitem',
                price:"9.85",
                category:'Lunch',
                //date_added:new Date('2016-01-16 12:55:00')
            }
            return shoppinglistservice.updateitem(knex,idofitem,newitem)
            .then(()=>shoppinglistservice.getById(db,idofitem))
            .then(item=>{
                expect(item).to.eql({
                    id:idofitem,
                    ...newitem,
                })
            })
        })
    
    })
    
})
