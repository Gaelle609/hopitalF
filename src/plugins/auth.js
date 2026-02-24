export default {
  install(app) {
    app.config.globalProperties.$can = (permission) => {
      const perms = JSON.parse(localStorage.getItem("current_permissions") || "[]");
      return perms.includes(permission);
    };

    app.config.globalProperties.$hasRole = (roleName) => {
      const roles = JSON.parse(localStorage.getItem("current_role") || "[]");
      return roles.some(role => role.name === roleName);
    };
  }
};