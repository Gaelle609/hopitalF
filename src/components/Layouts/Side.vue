<template>
  <aside id="sidebar" class="sidebar">
    <div class="adminuiux-sidebar">
      <div class="adminuiux-sidebar-inner">
        <div class="px-3 not-iconic mt-3">
          <div class="row">
            <div class="col align-self-center">
              <p class="h6">Menu</p>
            </div>
            <div class="col-auto">
              <a
                class="btn btn-link btn-square"
                data-bs-toggle="collapse"
                data-bs-target="#usersidebarprofile"
                aria-expanded="false"
                role="button"
                aria-controls="usersidebarprofile"
                ><i data-feather="user"></i
              ></a>
            </div>
          </div>
          <div class="text-center collapse" id="usersidebarprofile">
            <figure class="avatar avatar-100 rounded-circle coverimg my-3">
              <img src="../../assets/img/modern-ai-image/user-6.jpg" alt="" />
            </figure>
            <p class="mb-1 h5">Dr. Alice</p>
            <p class="small">The Clinical UI Kit</p>
          </div>
        </div>
        <ul class="nav flex-column menu-active-line my-3">
          <li class="nav-item">
            <a href="clinic-dashboard.html" class="nav-link"
              ><i class="menu-icon" data-feather="grid"></i>
              <span class="menu-name">Tableau de Bord</span></a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              href="javascrit:void(0)"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              ><i class="menu-icon" data-feather="users"></i>
              <span class="menu-name">Patients</span></a
            >
            <div class="dropdown-menu">
              <div class="nav-item">
                <a href="clinic-schedule.html" class="nav-link"
                  ><i class="menu-icon" data-feather="table"></i>
                  <span class="menu-name">Liste Patient </span></a
                >
              </div>

              <div class="nav-item">
                <router-link :to="{ name: 'Parameter' }" class="nav-link">
                  <i class="menu-icon bi bi-thermometer-half"></i>
                  <span class="menu-name"> Paramètre Patient</span>
                </router-link>
              </div>
            </div>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'indexPersonnel' }" class="nav-link"
              ><i class="menu-icon bi bi-person"></i>
              <span class="menu-name">Personnel</span></router-link
            >
          </li>
          <li class="nav-item">

            <router-link :to="{ name: 'Product' }" class="nav-link">
             <i class="menu-icon bi bi-bag-plus"></i>
              <span class="menu-name">Pharmacie</span>
            </router-link>
        
          </li>
          <li class="nav-item">
            <a href="clinic-blogs.html" class="nav-link">
              <i class="menu-icon bi bi-pass"></i>
              <span class="menu-name">Laboratoire</span></a
            >
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Caisse' }" class="nav-link">
              <i class="menu-icon bi bi-cash-stack"></i>
              <span class="menu-name">Caisse</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'Service' }" class="nav-link">
              <i data-feather="layers" class="me-0 me-md-1"></i>
              <span class="menu-name">Service</span>
            </router-link>
          </li> 

          <li class="nav-item dropdown">
            <a
              href="javascrit:void(0)"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              ><i class="menu-icon" data-feather="folder"></i>
              <span class="menu-name">Documents</span></a
            >
            <div class="dropdown-menu">
              <div class="nav-item">
                <a href="clinic-patients-documents.html" class="nav-link"
                  ><i class="menu-icon" data-feather="users"></i>
                  <span class="menu-name">Dossier Medicale</span></a
                >
              </div>
              <div class="nav-item">
                <a href="clinic-staff-documents.html" class="nav-link"
                  ><i class="menu-icon" data-feather="briefcase"></i>
                  <span class="menu-name"> Documents Staff</span></a
                >
              </div>
            </div>
          </li>

          <li class="nav-item">
            <a href="clinic-personalization.html" class="nav-link"
              ><i class="menu-icon bi bi-palette h6"></i>
              <span class="menu-name">Personaliser L'interface ❤️</span></a
            >
          </li>
        </ul>
        <div class="mt-auto"></div>
        <div class="px-3 mb-3 not-iconic">
          <p class="mb-3 h6">Quick Links</p>
          <div class="card border-0">
            <div class="card-body p-2">
              <div class="row gx-2">
                <div class="col-12 d-flex justify-content-between">
                  <a
                    href="clinic-myprofile.html"
                    class="btn btn-square btn-link"
                    ><span class="position-relative"
                      ><i data-feather="user"></i>
                      <span
                        class="position-absolute top-0 start-100 translate-middle p-1 bg-success rounded-circle"
                        ><span class="visually-hidden">New alerts</span>
                      </span></span
                    ></a
                  ><a
                    href="clinic-schedule.html"
                    class="btn btn-square btn-link"
                    ><span class="position-relative"
                      ><i data-feather="calendar"></i>
                      <span
                        class="position-absolute top-0 start-100 translate-middle p-1 bg-warning rounded-circle"
                        ><span class="visually-hidden">New alerts</span>
                      </span></span
                    ></a
                  ><a href="clinic-inbox.html" class="btn btn-square btn-link"
                    ><i data-feather="inbox"></i> </a
                  ><a
                    href="clinic-help-center.html"
                    class="btn btn-square btn-link"
                    ><i data-feather="help-circle"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="nav flex-column menu-active-line">
          <li class="nav-item">
            <a href="clinic-settings.html" class="nav-link"
              ><i class="menu-icon" data-feather="settings"></i>
              <span class="menu-name">Settings</span></a
            >
          </li>
        </ul>
      </div>
    </div>
  </aside>
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
