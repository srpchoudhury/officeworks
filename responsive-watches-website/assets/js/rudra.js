$(document).ready(function () {

  $(document.body).ready(function () {
    const withoutLoginItems = getStorage();
    renderCartItemsWithoutLogin(withoutLoginItems);
    
  });

 
  var loggedInUser;
  // Function to get users from local storage
  function getUsersFromStorage() {
    const usersData = localStorage.getItem("users");
    return usersData ? JSON.parse(usersData) : [];
  }

  // Function to store users in local storage
  function storeUsersInStorage(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function renderCartItems(user) {
    const cartContainer = $(".cart__container");
    cartContainer.empty();

    for (const cartItem of user.cart) {
      const cartCard = `
        <article class="cart__card">
          <div class="cart__box">
            <img src="${cartItem.img}" alt="" class="cart__img">
          </div>
          <div class="cart__details">
            <h3 class="cart__title">${cartItem.title}</h3>
            <span class="cart__price">${cartItem.price}</span>
            <div class="cart__amount">
              <div class="cart__amount-content">
                <span class="cart__amount-box">
                  <i class='bx bx-minus'></i>
                </span>
                <span class="cart__amount-number">${cartItem.quantity}</span>
                <span class="cart__amount-box">
                  <i class='bx bx-plus'></i>
                </span>
              </div>
              <i class='bx bx-trash-alt cart__amount-trash'></i>
            </div>
          </div>
        </article>
      `;

      cartContainer.append(cartCard);
       // Call the renderTotalPrice function
      
    }
  }
  
    $(".cart__container").on("click", ".bx-plus", function () {
    
      const cartItem = $(this).closest(".cart__card");
      const itemIndex = cartItem.index();

      if (loggedInUser) {
        const users = getUsersFromStorage(); // Retrieve users from storage
        loggedInUser.cart[itemIndex].quantity++;
      
        storeUsersInStorage(users); // Update the user's cart in local storage
        updateCartItemUI(cartItem, loggedInUser.cart[itemIndex]);
      } else {
        const withoutLoginItems = getStorage();
        withoutLoginItems[itemIndex].quantity++;
        localStorage.setItem("withoutLogin", JSON.stringify(withoutLoginItems));
        updateCartItemUI(cartItem, withoutLoginItems[itemIndex]);
      }
    });

   

    // Event listener for minus icon click
    $(".cart__container").on("click", ".bx-minus", function () {
    
      const cartItem = $(this).closest(".cart__card");
      const itemIndex = cartItem.index();

      if (loggedInUser) {
        const users = getUsersFromStorage(); 
        if (loggedInUser.cart[itemIndex].quantity > 1) {
          loggedInUser.cart[itemIndex].quantity--;
          storeUsersInStorage(users); // Update the user's cart in local storage
          updateCartItemUI(cartItem, loggedInUser.cart[itemIndex]);
        } else {
          loggedInUser.cart.splice(itemIndex, 1); // Remove item from cart array
          storeUsersInStorage(users); // Update the user's cart in local storage
          cartItem.remove(); // Remove the cart item from the UI
        }
      } else {
        const withoutLoginItems = getStorage();
        if (withoutLoginItems[itemIndex].quantity > 1) {
          withoutLoginItems[itemIndex].quantity--;
          localStorage.setItem("withoutLogin", JSON.stringify(withoutLoginItems));
          updateCartItemUI(cartItem, withoutLoginItems[itemIndex]);
        } else {
          withoutLoginItems.splice(itemIndex, 1); // Remove item from withoutLogin array
          localStorage.setItem("withoutLogin", JSON.stringify(withoutLoginItems));
          cartItem.remove(); // Remove the cart item from the UI
        }
      }
    });

    // Function to update cart item UI
    function updateCartItemUI(cartItemElement, cartItem) {
      const quantityElement = cartItemElement.find(".cart__amount-number");
      const priceElement = cartItemElement.find(".cart__price");
      const subtotal = (parseFloat(cartItem.price) * cartItem.quantity).toFixed(2);

      quantityElement.text(cartItem.quantity);
      priceElement.text(subtotal);

      if (loggedInUser) {
        const users = getUsersFromStorage();
        const userIndex = users.findIndex(user => user.username === loggedInUser.username);
        if (userIndex !== -1) {
          users[userIndex] = loggedInUser;
          storeUsersInStorage(users);
        }
      }
    }

 
   
    


  

   


   
















  $("#signupForm").submit(function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input field values
    const username = $("#signupUsername").val();
    const password = $("#signupPassword").val();
    const confirmPassword = $("#confirmPassword").val();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Get existing users from storage
    const users = getUsersFromStorage();
    // console.log(users);

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    // console.log(existingUser);
    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    // Create a new user object
    const newUser = {
      username: username,
      password: password,
      cart: []
    };

    // Add the new user to the users array
    users.push(newUser);
    console.log(users);


    // Store the updated users array in local storage
    storeUsersInStorage(users);

    // Close the modal
    $("#signupModal").modal("hide");


   

    // Clear input fields
    $("#signupUsername").val("");
    $("#signupPassword").val("");
    $("#confirmPassword").val("");

    // Optionally, you can display a success message or perform other actions
  });

  // Rest of your code...

  // Handle login form submission
  $("#loginForm").submit(function (event) {

    event.preventDefault(); // Prevent form submission



    // Get input field values
    const username = $("#username").val();
    const password = $("#password").val();

    // Get existing users from storage
    const users = getUsersFromStorage();

    // Find the user by username and password
    var loginUser = users.find(user => user.username === username && user.password === password);
    // console.log(loginUser);

    if (loginUser) {
      alert("Login successful!");



      $("#loginModal").modal("hide");

      $("#username").val("");
      $("#password").val("");
      loggedInUser = loginUser;
      //give a logout icon of bx-user-circle
      $("#login").find(".bx-user").addClass("logged-in-icon").removeClass("bx-user").text(username.slice(0, 1).toUpperCase());
      $("#welcomeMessage").text(`logout`);

      console.log(loggedInUser);

      renderCartItems(loginUser);



    } else {
      alert("Login denied. Please check your username and password.");
    }
  });




  $(".featured__button, .new__button, .products__button").click(function () {
    const itemCard = $(this).closest(".featured__card, .new__card, .products__card");
    const title = itemCard.find(".featured__title, .new__title, .products__title").text();
    const price = itemCard.find(".featured__price, .new__price, .products__price").text();
    const imageSrc = itemCard.find(".featured__img, .new__img, .products__img").attr("src");

    const cartItem = {
      title: title,
      price: price,
      img: imageSrc,
      quantity: 1
    };
    // console.log(loggedInUser);

    if (loggedInUser) {
      // If a user is logged in, add the item to their cart
      loggedInUser.cart.push(cartItem);

      // Update the user's cart information in local storage
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(user => user.username === loggedInUser.username);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        storeUsersInStorage(users);
      }

      renderCartItems(loggedInUser);
    } else {
      // If no user is logged in, add the item to the withoutLogin JSON
      const withoutLoginItems = getStorage();
      withoutLoginItems.push(cartItem);
      localStorage.setItem("withoutLogin", JSON.stringify(withoutLoginItems));
      renderCartItemsWithoutLogin(withoutLoginItems);
    }
  });

  function getStorage() {
    const itemsData = localStorage.getItem("withoutLogin");
    return itemsData ? JSON.parse(itemsData) : [];
  }

  function renderCartItemsWithoutLogin(withoutLoginItems) {
    const cartContainer = $(".cart__container");
    cartContainer.empty();

    for (const item of withoutLoginItems) {
      const cartCard = `
          <article class="cart__card">
            <div class="cart__box">
              <img src="${item.img}" alt="" class="cart__img">
            </div>
            <div class="cart__details">
              <h3 class="cart__title">${item.title}</h3>
              <span class="cart__price">${item.price}</span>
              <div class="cart__amount">
                <div class="cart__amount-content">
                  <span class="cart__amount-box">
                    <i class='bx bx-minus'></i>
                  </span>
                  <span class="cart__amount-number">${item.quantity}</span>
                  <span class="cart__amount-box">
                    <i class='bx bx-plus'></i>
                  </span>
                </div>
                <i class='bx bx-trash-alt cart__amount-trash'></i>
              </div>
            </div>
          </article>
        `;
        
      cartContainer.append(cartCard);
    }
  }

  // $(".cart__container").on("click", ".cart__amount-trash", function () {
  //   $(this).closest(".cart__card").remove();
  // });

  // Logout function
  function logout() {
    const shouldLogout = confirm("Are you sure you want to logout?");
    if (shouldLogout) {
      loggedInUser = null;
      $("#login").find(".logged-in-icon").addClass("bx-user").removeClass("logged-in-icon").text('');
      $("#welcomeMessage").text('');

      renderCartItemsWithoutLogin(getStorage());
    }
  }


  // Add click event to logout icon
  $("#login").on("click", ".logged-in-icon", function () {
    logout();
  });

  /* when the user click on the cart_container trash icon then the item will be removed from the local storage if logged in then remove from that user's cart else remove from withoutLogin JSON */
  $(".cart__container").on("click", ".cart__amount-trash", function () {

    const cartItem = $(this).closest(".cart__card");
    const cartItemTitle = cartItem.find(".cart__title").text();
    const cartItemPrice = cartItem.find(".cart__price").text();
    const cartItemImage = cartItem.find(".cart__img").attr("src");

    if (loggedInUser) {
      // If a user is logged in, remove the item from their cart
      loggedInUser.cart = loggedInUser.cart.filter(item => item.title !== cartItemTitle || item.price !== cartItemPrice || item.img !== cartItemImage);
      // console.log(loggedInUser.cart);


      // Update the user's cart information in local storage
      const users = getUsersFromStorage();
      const userIndex = users.findIndex(user => user.username === loggedInUser.username);
      // console.log(userIndex);
      if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
        storeUsersInStorage(users);
      }
      renderCartItems(loggedInUser);
    } else {
      // If no user is logged in, remove the item from the withoutLogin JSON
      const withoutLoginItems = getStorage();
      const itemIndex = withoutLoginItems.findIndex(item => item.title === cartItemTitle && item.price === cartItemPrice && item.img === cartItemImage);
      console.log(itemIndex);
      if (itemIndex !== -1) {
        withoutLoginItems.splice(itemIndex, 1);
        localStorage.setItem("withoutLogin", JSON.stringify(withoutLoginItems));
      }
      renderCartItemsWithoutLogin(withoutLoginItems);
    }
  });

});