const orders = [
  {
    "_id": "665e8a1e93b3c12c4a7f1a01",
    "orderNumber": "ORD123456789",
    "createdAt": "2024-12-25T10:30:00",
    "orderStatus": "delivered",
    "products": [
      {
        "_id": "665e8b2e93b3c12c4a7f1a11",
        "productId": {
          "_id": "664d812e93b3c12c4a7f1011",
          "title": "Classic White T-Shirt",
          "thumbnail": "https://picsum.photos/seed/prod1-10/500/800"
        },
        "size": "M",
        "quantity": 2,
        "originalPrice": 8999,
        "discountedPrice": 6899,
        "status": "delivered",
        "cancelledAt": null
      },
      {
        "_id": "665e8b3e93b3c12c4a7f1a12",
        "productId": {
          "_id": "664d812e93b3c12c4a7f1012",
          "title": "Black Hoodie",
          "thumbnail": "https://picsum.photos/seed/prod1-20/500/800"
        },
        "size": "L",
        "quantity": 1,
        "originalPrice": 1499,
        "discountedPrice": 1299,
        "status": "cancelled",
        "cancelledAt": null
      }
    ]
  },
  {
    "_id": "665e8a2e93b3c12c4a7f1a02",
    "orderNumber": "ORD123456675",
    "createdAt": "2024-12-27T14:45:00",
    "orderStatus": "cancelled",
    "products": [
      {
        "_id": "665e8b4e93b3c12c4a7f1a13",
        "productId": {
          "_id": "664d812e93b3c12c4a7f1013",
          "title": "Grey Joggers",
          "thumbnail": "https://picsum.photos/seed/prod1-40/500/800"
        },
        "size": "S",
        "quantity": 1,
        "originalPrice": 1199,
        "discountedPrice": 999,
        "status": "cancelled",
        "cancelledAt": "2024-12-28T08:00:00"
      }
    ]
  }
]

export default orders