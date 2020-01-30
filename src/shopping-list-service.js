


const shoppinglistservice={
    getAllShoppingList(knex){
        return knex.select('*').from('shopping_list')
    },
    addanitem(knex,newitem){
        return knex
        .insert(newitem)
        .into('shopping_list')
        .returning('*')
        .then(rows=>{
            return rows[0]
        })
    },
    getById(knex,id){
        return knex.from('shopping_list').select('*').where('id',id).first()
    },
    deleteanitem(knex,id){
        return knex('shopping_list')
        .where({id})
        .delete()
    },
    updateitem(knex,id,newupdatefield){
        return knex('shopping_list')
        .where({id})
        .update(newupdatefield)
    }
}

module.exports=shoppinglistservice;