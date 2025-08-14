
(function subscribeFeature() {
  const subscribeForm = document.getElementById('subscribeForm');
  const subMsg = document.getElementById('subMsg');
  
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('subEmail');
      const email = emailInput.value.trim();
      
      if (!email) {
        showMessage('Please enter an email address.', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      const subscriptions = JSON.parse(localStorage.getItem('bh_subscriptions') || '[]');
      
      if (subscriptions.includes(email)) {
        showMessage('You are already subscribed!', 'info');
        return;
      }
      
      subscriptions.push(email);
      localStorage.setItem('bh_subscriptions', JSON.stringify(subscriptions));
      
      showMessage('Successfully subscribed! Thank you for joining our newsletter.', 'success');
      emailInput.value = '';
    });
  }
  
  function showMessage(text, type) {
    if (subMsg) {
      subMsg.textContent = text;
      subMsg.style.position = 'static';
      subMsg.style.color = type === 'error' ? '#EE583F' : type === 'success' ? '#2E4057' : '#131C26';
      subMsg.style.fontWeight = 'bold';
      subMsg.style.marginTop = '0.5rem';
      
      setTimeout(() => {
        subMsg.style.position = 'absolute';
        subMsg.style.left = '-9999px';
      }, 5000);
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

(function contactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();
      
      if (!name || !email || !message) {
        showContactMessage('Please fill in all fields.', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showContactMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      const submissions = JSON.parse(localStorage.getItem('bh_contact_submissions') || '[]');
      const submission = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
      };
      
      submissions.push(submission);
      localStorage.setItem('bh_contact_submissions', JSON.stringify(submissions));
      
      showContactMessage('Thank you for your message! We will get back to you soon.', 'success');
      contactForm.reset();
    });
  }
  
  function showContactMessage(text, type) {
    if (contactMsg) {
      contactMsg.textContent = text;
      contactMsg.style.display = 'block';
      contactMsg.style.color = type === 'error' ? '#EE583F' : '#2E4057';
      contactMsg.style.backgroundColor = type === 'error' ? '#FFE6E6' : '#E8F5E8';
      contactMsg.style.padding = '10px';
      contactMsg.style.borderRadius = '4px';
      contactMsg.style.border = `2px solid ${type === 'error' ? '#EE583F' : '#2E4057'}`;
      
      setTimeout(() => {
        contactMsg.style.display = 'none';
      }, 8000);
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();

(function galleryPage() {
  const grid = document.getElementById('grid');
  if (!grid) return; 


  const items = [
    { id:'b1', type:'books', title:'Brie Mine 4Ever', img:'images/Client3_Book1.png' },
    { id:'b2', type:'books', title:'Glory Riders', img:'images/Client3_Book2.png' },
    { id:'b3', type:'books', title:"Sorcerer’s Shadowed Chronicles", img:'images/Client3_Book3.png' },
    { id:'m1', type:'magazines', title:'Ball (Pickleball)', img:'images/Client3_Magazine1.png' },
    { id:'m2', type:'magazines', title:'Travel', img:'images/Client3_Magazine2.png' },
    { id:'m3', type:'magazines', title:'Eat.', img:'images/Client3_Magazine3.png' },
    { id:'g1', type:'merch', title:'Sticker Pack', img:'images/Client3_Stickers.png' },
    { id:'g2', type:'merch', title:'Notebook', img:'images/Client3_Notebook.png' },
    { id:'g3', type:'merch', title:'Canvas Tote', img:'images/Client3_ToteBag.png' },
  ];


  const state = { page: 1, perPage: 9, filter: 'all' };


  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  const cartPanel = document.getElementById('cart');
  const cartList = document.getElementById('cartList');
  const cartEmpty = document.getElementById('cartEmpty');
  const viewCartBtn = document.getElementById('viewCart');
  const closeCartBtn = document.getElementById('closeCart');
  const clearCartBtn = document.getElementById('clearCart');
  const processOrderBtn = document.getElementById('processOrder');
  const cartCount = document.getElementById('cartCount');

  const CART_KEY = 'bh_cart';        
  const ORDERS_KEY = 'bh_orders';     

  const getCart = () => {
    try { return JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  };
  const setCart = (arr) => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(arr));
    updateCartCount();
  };
  const updateCartCount = () => { cartCount.textContent = String(getCart().length); };

  const getFiltered = () => state.filter === 'all'
      ? items
      : items.filter(i => i.type === state.filter);

  function render() {
    const data = getFiltered();
    const totalPages = Math.max(1, Math.ceil(data.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.perPage;
    const slice = data.slice(start, start + state.perPage);

    grid.innerHTML = slice.map(i => {
      const inCart = getCart().includes(i.id);
      return `
        <div class="tile" role="listitem">
          <img src="${i.img}" alt="${i.title}" loading="lazy" width="320" height="160">
          <div class="meta">
            <span class="title">${i.title}</span>
            <button class="btn add" data-id="${i.id}" aria-pressed="${inCart}">
              ${inCart ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    pageInfo.textContent = `Page ${state.page} of ${totalPages}`;
    prevBtn.disabled = state.page === 1;
    nextBtn.disabled = state.page === totalPages;
  }

  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => {
        b.classList.remove('active'); b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      state.filter = btn.dataset.filter;
      state.page = 1;
      render();
    });
  });
  


  prevBtn.addEventListener('click', () => { state.page--; render(); });
  nextBtn.addEventListener('click', () => { state.page++; render(); });

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.add'); if (!b) return;
    const id = b.dataset.id;
    const cart = new Set(getCart());
    if (cart.has(id)) cart.delete(id); else cart.add(id);
    setCart([...cart]);
    render();
  });


  function updateCartUI() {
    const cart = getCart();
    cartList.innerHTML = cart.map(id => {
      const item = items.find(i => i.id === id);
      return `<li>${item ? item.title : id}</li>`;
    }).join('');
    cartEmpty.style.display = cart.length ? 'none' : 'block';
  }

  viewCartBtn.addEventListener('click', () => {
    updateCartUI();
    cartPanel.hidden = false;
  });
  closeCartBtn.addEventListener('click', () => { cartPanel.hidden = true; });

  clearCartBtn.addEventListener('click', () => {
    if (!getCart().length) { alert('Cart is already empty.'); return; }
    setCart([]);
    updateCartUI();
    render();
    alert('Cart cleared.');
  });

  processOrderBtn.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) { alert('Your cart is empty.'); return; }

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.push({ items: cart, time: new Date().toISOString() });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));


    setCart([]);
    updateCartUI();
    render();

    alert('Order processed! Your order has been saved and will be processed within 24 hours.');
  });


  updateCartCount();
  render();
})();

// Hamburger Menu Functionality
(function hamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  
  if (hamburger && navList) {
    hamburger.addEventListener('click', function() {
      const isActive = navList.classList.contains('active');
      
      navList.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', !isActive);
      
      // Close menu when clicking outside
      if (!isActive) {
        document.addEventListener('click', closeMenuOnOutsideClick);
      } else {
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    });
    
    function closeMenuOnOutsideClick(e) {
      if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    }
    
    // Close menu when clicking on a nav link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
      });
    });
  }
})();