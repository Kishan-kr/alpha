### Need to add category ID (from mongoDB) manually in constant/category file `IMP` ###

### HOMEPAGE ###
  - Hero section `done`. Need to replace video
  - New Arrivals section `done`
  - product categories section `done`
  - search feature `done`

  - happy customers section `done`. Need to replace with real reviews data in temp/reviews and mongoDB as well

  - Lookbook section `done`. Need to replace video URLs in temp/lookbookData and mongoDB as well

### FOOTER ###
  - UI `done`. Need to add all pages 
  - setup newsletter left
  
### COLLECTIONS ###
  - collections page `done`

### SEARCH ###
  - search page `done`

### PRODUCT DETAILS ###
  - product details page `done`
  - fetching product by slug `done`
  - fetching more products excluding the current `done`
  - add to cart `done`
  - size chart `done`
  - need to update measurement guide image in size chart `IMP` 

### SHOPPING BAG ###
  - shopping bag page: done inc-dec and remove items from bag for all users `done`
  - shopping bag page: tested inc-dec and remove items from bag for public users only `done`
  - shopping bag page: test inc-dec and remove items from bag for logged in users `IMP`


- add loader and error element in new arrivals section
- add use of getBagProduct utility function in search products page, all products page, and new arrivals section

working on get latest stock inside increase quantitiy function in shopping bag

### USER ###
- add login and signup page frontend as well as backend
- created middleware to verify user but not tested yet
- fixed login and signup pages styling
- created logout route and controller but not used in frontend yet

### USER PROFILE ###
- created user profile page completely
- update name modal completed
- upate email modal completed
- upate email format in backend
- remove unnecessary fields from validate phone controller before sending to client
- replace 'OTP' with 'code' in validate email controller
- add new route and controller for updating all addresses at once
- need to test edit address page and update api call, there are some fields mismatch [IMP]