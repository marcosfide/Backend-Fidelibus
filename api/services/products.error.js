const generateInvalidProductDataError = ({ title, description, code, price, status, stock, category, thumbnail }) => {
    return `Invalid product data:
    * title should be a non-empty String, recived: ${title === '' ? undefined : title } (${ title === '' ? undefined : typeof title})
    * description should be a non-empty String, recived: ${description === '' ? undefined : description} (${description === '' ? undefined : typeof description})
    * code should be a non-empty String, recived: ${code === '' ? undefined : code} (${code === '' ? undefined : typeof code})
    * price should be a non-empty Number, recived: ${price === '' ? undefined : price} (${price === '' ? undefined : typeof price})
    * status should be a non-empty Boolean, recived: ${status === '' ? undefined : status} (${status === '' ? undefined : typeof status})
    * stock should be a non-empty Number, recived: ${stock === '' ? undefined : stock} (${stock === '' ? undefined : typeof stock})
    * category should be a non-empty String, recived: ${category === '' ? undefined : category} (${category === '' ? undefined : typeof category})
    * thumbnail should be a non-empty String, recived: ${thumbnail === '' ? undefined : thumbnail} (${thumbnail === '' ? undefined : typeof thumbnail})
    `
}

module.exports= { generateInvalidProductDataError }