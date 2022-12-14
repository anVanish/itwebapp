const db = require('../../config/db')

const Products = function(product){
    this.id = product.id
    this.name = product.name
    this.price = product.price
    this.qty_in_stock = product.qty_in_stock
    this.description = product.description
    this.brand_id = product.brand_id
    this.catalog_id = product.catalog_id
    this.gender_id = product.gender_id
    this.slug = product.slug
    this.origin = product.origin
    this.topic = product.topic
}

Products.getAllProducts = (callback) => {
    db.query("select * from products, images where products.product_id = images.product_id and images.isdefault = 1; select * from genders; select * from brands; select * from for_ages", (err, items) => {
        if (err){
            console.log(err)
            callback(null)
        }
        else{
            callback(items)
        }
    })
}

Products.getProductDetailBySlug = (slug, callback) => {
    var user_id = 1
    db.query("select * from products, brands, genders, for_ages, catalogies where products.brand_id = brands.brand_id and products.gender_id = genders.gender_id and products.for_age_id = for_ages.for_age_id and products.catalog_id = catalogies.catalog_id and products.slug = ?; select link from products, images where products.product_id = images.product_id and slug = ?; select count(user_id) as count from carts where carts.user_id = " + user_id + " group by user_id; select catalogies.catalog_id, catagory, cata_link, count(products.product_id) as count from catalogies, products where catalogies.catalog_id = products.catalog_id group by catalogies.catalog_id, catagory, cata_link;  select * from products, images where products.product_id = images.product_id and images.isdefault = 1 LIMIT 4" , [slug, slug], (err, product) => {
        if (err){
            console.log(err)
            callback(null)
        }
        else{
            callback(product)
        }
    })
}

Products.getFilter = (user_id, filter, callback) => {
    const show = 9
    const sort = filter.sort || 'asc';
    const page = (filter.page - 1) * show || 0;
    
    var sqlQuery1 = "select * from products, images, brands, genders, for_ages, catalogies where products.product_id = images.product_id and products.brand_id = brands.brand_id and products.gender_id = genders.gender_id and products.for_age_id = for_ages.for_age_id and products.catalog_id = catalogies.catalog_id and images.isdefault = 1"
    var sqlQuery2 = ";select * from genders; select * from brands; select * from for_ages; select * from catalogies; select count(user_id) as count from carts where user_id = " + user_id + " group by user_id"
    
    if (filter.brandsId){
        brandList = filter.brandsId.join(", ")
        sqlQuery1 += " and brands.brand_id in (" + brandList + ")"
    }
    if (filter.gendersId){
        genderList = filter.gendersId.join(", ")
        sqlQuery1 += " and genders.gender_id in (" + genderList + ")"
    }
    if (filter.for_agesId){
        for_ageList = filter.for_agesId.join(", ")
        sqlQuery1 += " and for_ages.for_age_id in (" + for_ageList + ")"
    }
    if (filter.catalog){
        sqlQuery1 += " and products.catalog_id = " + filter.catalog
    }

    sqlQuery1 += " Order by price " + sort
    sqlQuery1 += " Limit " + show + " Offset " + page

    db.query(sqlQuery1 + sqlQuery2, (err, items) => {
        if (err){
            console.log(err)
            callback(null)
        }
        else{
            callback(items)
        }
    })
}

module.exports = Products