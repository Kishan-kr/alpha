const sortOrderMap = {
  'asc': 1,
  'desc': -1
}

const validProductSortFields = [
  'createdAt', 
  'title', 
  'effectivePrice', 
]

module.exports = {
  sortOrderMap,
  validProductSortFields
}