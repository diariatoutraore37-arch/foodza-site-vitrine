// --- Données mock des restaurants ---
const restaurants = [
  {
    id:1,
    name:"La Tradition",
    city:"Bamako",
    country:"Mali",
    category:"Africain",
    avgPrice:1800,
    rating:4.7,
    time:"30-40 min",
    img:"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    tags:"Malienne · Halal",
    desc:"Cuisine malienne traditionnelle : tô, riz, sauces maison préparées par nos partenaires."
  },
  {
    id:2,
    name:"Le Gourmet",
    city:"Bamako",
    country:"Mali",
    category:"Europeen",
    avgPrice:2500,
    rating:4.5,
    time:"25-35 min",
    img:"https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
    tags:"Européen · Pâtes",
    desc:"Plats européens revisités pour le goût local. Pâtes, salades et plats du jour."
  },
  {
    id:3,
    name:"Pâtisserie Joyeux",
    city:"Bamako",
    country:"Mali",
    category:"Patisserie",
    avgPrice:1200,
    rating:4.8,
    time:"20-30 min",
    img:"https://images.unsplash.com/photo-1526312426976-3d75a1c9a6f9?q=80&w=1200&auto=format&fit=crop",
    tags:"Pâtisserie · Gâteaux",
    desc:"Gâteaux, éclairs, et viennoiseries préparés chaque matin par nos boulangers partenaires."
  },
  {
    id:4,
    name:"Chez Mamy (Abidjan style)",
    city:"Bamako",
    country:"Côte d'Ivoire",
    category:"Africain",
    avgPrice:1700,
    rating:4.6,
    time:"35-45 min",
    img:"https://images.unsplash.com/photo-1604908177572-6f0d8b7a6b0b?q=80&w=1200&auto=format&fit=crop",
    tags:"Ivoirien · Street-food",
    desc:"Spécialités ivoiriennes : attiéké, poisson braisé, plats riches en saveurs."
  },
  {
    id:5,
    name:"Dakar Grill",
    city:"Bamako",
    country:"Sénégal",
    category:"Africain",
    avgPrice:2000,
    rating:4.4,
    time:"30-50 min",
    img:"https://images.unsplash.com/photo-1604908177572-6f0d8b7a6b0b?q=80&w=1200&auto=format&fit=crop",
    tags:"Sénégalais · Grillades",
    desc:"Cuisine sénégalaise : thieboudienne authentique, grillades et accompagnements."
  }
];

// --- Helpers ---
function formatFCFA(n){
  // format with space thousands and add FCFA
  return n.toLocaleString('fr-FR') + ' FCFA';
}

// --- Render cards ---
const grid = document.getElementById('restaurantsGrid');
const paginationEl = document.getElementById('pagination');
let currentPage = 1;
const perPage = 6;

function getFilteredData({search='', city='Bamako', category='All'}){
  let data = restaurants.slice();
  if(city && city !== 'Toutes' && city !== 'Toutes'){
    if(city !== 'Toutes') data = data.filter(r=> (city==='Toutes' ? true : r.city===city));
  }
  if(category && category !== 'All'){
    data = data.filter(r => r.category === category);
  }
  if(search && search.trim().length>0){
    const s = search.toLowerCase();
    data = data.filter(r => r.name.toLowerCase().includes(s) || r.tags.toLowerCase().includes(s) || r.desc.toLowerCase().includes(s));
  }
  return data;
}

function renderGrid(data){
  grid.innerHTML = '';
  if(data.length === 0){
    grid.innerHTML = `<div class="col-12"><div class="alert alert-secondary">Aucun restaurant trouvé.</div></div>`;
    paginationEl.innerHTML = '';
    return;
  }
  // pagination simple
  const total = data.length;
  const pages = Math.ceil(total / perPage);
  if(currentPage > pages) currentPage = 1;
  const start = (currentPage-1)*perPage;
  const pageItems = data.slice(start, start+perPage);

  pageItems.forEach(r => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card card-restaurant h-100">
        <div class="img-wrap position-relative">
          <img src="${r.img}" alt="${r.name}">
          <div class="badge-rating">${r.rating} <i class="bi bi-star-fill"></i></div>
        </div>
        <div class="p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">${r.name}</h5>
            <div class="text-end small text-muted">${r.city}</div>
          </div>
          <p class="mb-2 text-muted small">${r.tags}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="small text-muted">${r.time}</div>
            <div class="price">${formatFCFA(r.avgPrice)}</div>
          </div>
          <div class="mt-3 d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm btn-menu" data-id="${r.id}">Voir le menu</button>
            <button class="btn btn-cta btn-sm ms-auto btn-order" data-id="${r.id}">Commander</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  // render pagination
  paginationEl.innerHTML = '';
  for(let i=1;i<=pages;i++){
    const li = document.createElement('li');
    li.className = 'page-item ' + (i===currentPage?'active':'');
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e)=>{
      e.preventDefault();
      currentPage = i;
      applyFilters();
      window.scrollTo({top:200,behavior:'smooth'});
    });
    paginationEl.appendChild(li);
  }

  // attach listeners to menu/order
  document.querySelectorAll('.btn-menu').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = parseInt(b.getAttribute('data-id'));
      openModal(id);
    });
  });
  document.querySelectorAll('.btn-order').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = parseInt(b.getAttribute('data-id'));
      // go to commande page (could pass restaurant id via query string)
      window.location.href = "livraison.html?plat=" + encodeURIComponent(plat);
    });
  });
}

// --- Modal open ---
function openModal(id){
  const r = restaurants.find(x=>x.id===id);
  if(!r) return;
  document.getElementById('modalImage').src = r.img;
  document.getElementById('modalName').textContent = r.name;
  document.getElementById('modalTags').textContent = r.tags;
  document.getElementById('modalDesc').textContent = r.desc;
  document.getElementById('modalLocation').textContent = r.city + ' • ' + r.country;
  document.getElementById('modalTime').textContent = r.time;
  document.getElementById('modalPrice').textContent = formatFCFA(r.avgPrice);
  document.getElementById('modalMenuBtn').href = `plats.html?restaurant=${id}`;
  const modal = new bootstrap.Modal(document.getElementById('restaurantModal'));
  modal.show();
}

// --- Apply filters / search / sort ---
function applyFilters(){
  const search = document.getElementById('searchInput').value || '';
  const city = document.getElementById('cityFilter').value || 'Bamako';
  const activeCatBtn = document.querySelector('.filter-btn.active');
  const category = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'All';
  let data = getFilteredData({search, city: city==='Toutes'? 'Toutes' : city, category});
  // sort
  const sort = document.getElementById('sortSelect').value;
  if(sort === 'rating'){
    data.sort((a,b)=> b.rating - a.rating);
  } else if(sort === 'price-asc'){
    data.sort((a,b)=> a.avgPrice - b.avgPrice);
  } else if(sort === 'price-desc'){
    data.sort((a,b)=> b.avgPrice - a.avgPrice);
  } // else 'popular' keep order
  renderGrid(data);
}

// --- Events ---
document.getElementById('searchBtn').addEventListener('click', ()=>{ currentPage = 1; applyFilters(); });
document.getElementById('searchInput').addEventListener('keyup', (e)=>{ if(e.key==='Enter'){ currentPage = 1; applyFilters(); }});
document.getElementById('cityFilter').addEventListener('change', ()=>{ currentPage = 1; applyFilters(); });

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentPage = 1;
    applyFilters();
  });
});

document.getElementById('sortSelect').addEventListener('change', ()=>{ currentPage = 1; applyFilters(); });

// init
applyFilters();
