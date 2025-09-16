<template>
  <header class="adminuiux-header">
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container-fluid"><button class="btn btn-link btn-square sidebar-toggler" type="button"
                    onclick="initSidebar()"><i class="sidebar-svg" data-feather="menu"></i></button> 
                    <a class="navbar-brand" href="clinic-dashboard.html">
                        <img data-bs-img="light" src="../../assets/img/wecare.png" alt="" class="height-60 width-60 mb-3"> 
                        <img data-bs-img="dark" src="../../assets/img/wecare.png" alt="" class="height-60 width-60 mb-3">
                    <div class=""><span class="company-name text-uppercase h4"><b>We</b>Care</span>
                        <!-- <p class="company-tagline">AdminUIUX HTML template</p> -->
                    </div>
                </a>
                <div class="collapse navbar-collapse right-in-device" id="header-navbar">
                    <ul class="navbar-nav mx-lg-3 mb-2 mb-md-0">
                        <li class="nav-item"><a class="nav-link" href="clinic-dashboard.html">Acceuil</a></li>                        
                    </ul>
                </div>
                <div class="ms-auto"></div>
                <div class="input-group input-group-md width-300 rounded search-wrap d-none d-xxl-flex mx-2"><span
                        class="input-group-text border-0 bg-none"><i data-feather="search"></i></span> <input
                        class="form-control pe-0 border-0 bg-none" type="search" placeholder="Type something here..."
                        id="searchglobal">
                    <div class="dropdown input-group-text border-0 p-0"><button
                            class="dropdown-toggle btn btn-link btn-square no-caret" type="button" id="searchfilter"
                            data-bs-toggle="dropdown" aria-expanded="false"><i data-feather="sliders"></i></button>
                        <div class="dropdown-menu dropdown-menu-end dropdown-dontclose width-300"
                            aria-labelledby="searchfilter">
                            <ul class="nav adminuiux-nav" id="searchtab" role="tablist">
                                <li class="nav-item" role="presentation"><button class="nav-link active"
                                        id="searchall-tab" data-bs-toggle="tab" data-bs-target="#searchall"
                                        type="button" role="tab" aria-controls="searchall"
                                        aria-selected="true">All</button></li>
                                <li class="nav-item" role="presentation"><button class="nav-link" id="searchorders-tab"
                                        data-bs-toggle="tab" data-bs-target="#searchorders" type="button" role="tab"
                                        aria-controls="searchorders" aria-selected="false" tabindex="-1">Orders</button>
                                </li>
                                <li class="nav-item" role="presentation"><button class="nav-link"
                                        id="searchcontacts-tab" data-bs-toggle="tab" data-bs-target="#searchcontacts"
                                        type="button" role="tab" aria-controls="searchcontacts" aria-selected="false"
                                        tabindex="-1">Contacts</button></li>
                            </ul>
                            <div class="tab-content py-3" id="searchtabContent">
                                <div class="tab-pane fade active show" id="searchall" role="tabpanel"
                                    aria-labelledby="searchall-tab">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none show">
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Search apps</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch1"> <label
                                                            class="form-check-label" for="isearchswitch1"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Include Pages</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch2"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch2"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Internet resource</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch3"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch3"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">News and Blogs</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch4"> <label
                                                            class="form-check-label" for="isearchswitch4"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-pane fade" id="searchorders" role="tabpanel"
                                    aria-labelledby="searchorders-tab">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none show">
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Show order ID</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch5"> <label
                                                            class="form-check-label" for="isearchswitch5"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">International Order</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch6"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch6"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Taxable Product</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch7"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch7"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Published Product</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch8"> <label
                                                            class="form-check-label" for="isearchswitch8"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-pane fade" id="searchcontacts" role="tabpanel"
                                    aria-labelledby="searchcontacts-tab">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none show">
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Have email ID</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch9"> <label
                                                            class="form-check-label" for="isearchswitch9"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Have phone number</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch10"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch10"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Photo available</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch11"
                                                            :checked="true"> <label class="form-check-label"
                                                            for="isearchswitch11"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Referral</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="isearchswitch12"> <label
                                                            class="form-check-label" for="isearchswitch12"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="">
                                <div class="row">
                                    <div class="col"><button class="btn btn-link">Reset</button></div>
                                    <div class="col-auto"><button class="btn btn-theme">Apply</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ms-auto"><button class="btn btn-link btn-square btnsunmoon btn-link-header"
                        id="btn-layout-modes-dark-page"><i class="sun mx-auto" data-feather="sun"></i> <i
                            class="moon mx-auto" data-feather="moon"></i></button> <button
                        class="btn btn-link btn-square btn-icon btn-link-header d-inline-block d-xxl-none" type="button"
                        onclick="openSearch()"><i data-feather="search"></i></button>
                   
                    <div class="dropdown d-none d-sm-inline-block"><button
                            class="btn btn-link btn-square btn-icon btn-link-header dropdown-toggle no-caret"
                            type="button" data-bs-toggle="dropdown" aria-expanded="false"><i
                                class="bi bi-translate"></i></button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item active" data-value="EN">EN - English</a></li>
                            <li><a class="dropdown-item" data-value="FR">FR - French</a></li>
                            
                        </ul>
                    </div>
                    <div class="dropdown d-inline-block"><button
                            class="btn btn-link btn-square btn-icon btn-link-header dropdown-toggle no-caret"
                            type="button" data-bs-toggle="dropdown" aria-expanded="false"><i data-feather="bell"></i>
                            <span
                                class="position-absolute top-0 end-0 badge rounded-pill bg-danger p-1"><small>9+</small>
                                <span class="visually-hidden">unread messages</span></span></button>
                        <ul class="dropdown-menu dropdown-menu-end notification-dd sm-mi-95px">
                            <li><a class="dropdown-item" href="#">
                                    <p class="mb-0">Congratulation! Your property <span class="fw-bold">#H10215</span>
                                        has reached 1000 views.</p><span class="row"><span class="col"><span
                                                class="badge badge-light rounded-pill text-bg-warning small">Directory</span></span>
                                        <span class="col-auto small opacity-50">1:00 am</span></span>
                                </a></li>
                            <li class="text-center"><button class="btn btn-link text-center"
                                    onclick="notifcationAll()">View all <i class="bi bi-arrow-right fs-14"></i></button>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown d-inline-block"><a
                            class="dropdown-toggle btn btn-link btn-link-header style-none" id="userprofiledd"
                            data-bs-toggle="dropdown" aria-expanded="false" role="button">
                            <div class="row gx-0 d-inline-flex">
                                <div class="col-auto align-self-center">
                                    <figure class="avatar avatar-28 rounded-circle coverimg vm">
                                        <img :src="user.picture || defaultAvatar" alt=""
                                            id="userphotoonboarding2"></figure>
                                </div>
                                <div class="col align-self-center d-none d-xl-block px-2"><span
                                        class="mb-0">{{ user.first_name }}</span></div>
                            </div>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end width-300 pt-0 px-0 sm-mi-45px"
                            aria-labelledby="userprofiledd">
                            <div class="bg-theme-1-space rounded py-3 mb-3 dropdown-dontclose">
                                 <div class="row gx-0">
                                        <div class="col-auto px-3">
                                        <figure class="avatar avatar-50 rounded-circle coverimg vm">
                                            <img :src="user.picture || defaultAvatar" alt="Photo de profil">
                                        </figure>
                                        </div>
                                        <div class="col align-self-center">
                                        <p class="mb-1"><span>{{ user.first_name }} {{ user.last_name }}</span></p>
                                        </div>
                                    </div>
                            </div>
                            <div class="px-2">
                                <div>
                                    <router-link to="/home/profile" class="dropdown-item">
                                        <i data-feather="user" class="avatar avatar-18 me-1"></i>
                                        <span>Mon Profile</span>
                                    </router-link>
                                    
                                </div>
                            
                                <div><a class="dropdown-item" href="clinic-settings.html"><i data-feather="settings"
                                            class="avatar avatar-18 me-1"></i> Parametre du compte</a></div>
                                <div><a class="dropdown-item theme-red" href="clinic-login.html"><i data-feather="power"
                                            class="avatar avatar-18 me-1"></i> Déconnexion</a></div>
                            </div>
                        </div>
                    </div><button class="navbar-toggler btn btn-link btn-link-header btn-square btn-icon collapsed"
                        type="button" data-bs-toggle="collapse" data-bs-target="#header-navbar"
                        aria-controls="header-navbar" aria-expanded="false" aria-label="Toggle navigation"><i
                            data-feather="more-vertical" class="openbtn"></i> <i data-feather="x"
                            class="closebtn"></i></button>
                </div>
            </div>
        </nav>
        <div class="adminuiux-search-full">
            <div class="row gx-2 align-items-center">
                <div class="col-auto"><button class="btn btn-square btn-icon" type="button" onclick="closeSearch()"><i
                            data-feather="arrow-left"></i></button></div>
                <div class="col"><input class="form-control pe-0 border-0" type="search"
                        placeholder="Type something here..."></div>
                <div class="col-auto">
                    <div class="dropdown input-group-text border-0 p-0"><button
                            class="dropdown-toggle btn btn-link no-caret" type="button" id="searchfilter2"
                            data-bs-toggle="dropdown" aria-expanded="false"><i data-feather="sliders"></i></button>
                        <div class="dropdown-menu dropdown-menu-end dropdown-dontclose width-300"
                            aria-labelledby="searchfilter">
                            <ul class="nav adminuiux-nav" id="searchtab2" role="tablist">
                                <li class="nav-item" role="presentation"><button class="nav-link active"
                                        id="searchall-tab2" data-bs-toggle="tab" data-bs-target="#searchall2"
                                        type="button" role="tab" aria-controls="searchall2"
                                        aria-selected="true">All</button></li>
                                <li class="nav-item" role="presentation"><button class="nav-link" id="searchorders-tab2"
                                        data-bs-toggle="tab" data-bs-target="#searchorders2" type="button" role="tab"
                                        aria-controls="searchorders2" aria-selected="false"
                                        tabindex="-1">Orders</button></li>
                                <li class="nav-item" role="presentation"><button class="nav-link"
                                        id="searchcontacts-tab2" data-bs-toggle="tab" data-bs-target="#searchcontacts2"
                                        type="button" role="tab" aria-controls="searchcontacts2" aria-selected="false"
                                        tabindex="-1">Contacts</button></li>
                            </ul>
                            <div class="tab-content py-3" id="searchtabContent2">
                                <div class="tab-pane fade active show" id="searchall2" role="tabpanel"
                                    aria-labelledby="searchall-tab2">
                                    <ul class="list-group adminuiux-list-group list-group-flush bg-none show">
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Search apps</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="searchswitch1"> <label
                                                            class="form-check-label" for="searchswitch1"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Include Pages</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="searchswitch2" :checked="true">
                                                        <label class="form-check-label" for="searchswitch2"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">Internet resource</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="searchswitch3" :checked="true">
                                                        <label class="form-check-label" for="searchswitch3"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="list-group-item">
                                            <div class="row">
                                                <div class="col">News and Blogs</div>
                                                <div class="col-auto">
                                                    <div class="form-check form-switch"><input class="form-check-input"
                                                            type="checkbox" role="switch" id="searchswitch4"> <label
                                                            class="form-check-label" for="searchswitch4"></label></div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                
                            </div>
                            <div class="">
                                <div class="row">
                                    <div class="col"><button class="btn btn-link">Reset</button></div>
                                    <div class="col-auto"><button class="btn btn-theme">Apply</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>


<script>
export default {
  data() {
    return {
      user: {},
      defaultAvatar: "../../assets/img/avatar.jpg",
      baseUrl: "http://127.0.0.1:8000/", // ton backend Laravel
    };
  },
  mounted() {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // si le user a une image, on lui ajoute l'URL complète
      if (parsedUser.picture) {
        parsedUser.picture = this.baseUrl + parsedUser.picture;
      }

      this.user = parsedUser;
    } else {
      this.user = {
        first_name: "Utilisateur",
        last_name: "",
        picture: null,
      };
    }
  }
};
</script>
