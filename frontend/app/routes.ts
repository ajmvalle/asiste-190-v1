import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Landing page
  index("routes/home.tsx"),

  // Rutas de autenticación
  route("auth", "routes/auth/AuthPageLayout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),

  // Rutas de la aplicación
  route("app", "layout/AppLayout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
  ]),

  /*
  Rutas de la plantilla TailAdmin (https://tailadmin.dev)
   */
  route("theme", "layout/theme/AppLayout.tsx", [
    index("routes/theme/Dashboard/Home.tsx"),
    route("profile", "routes/theme/UserProfiles.tsx"),
    route("calendar", "routes/theme/Calendar.tsx"),
    route("blank", "routes/theme/Blank.tsx"),

    route("form-elements", "routes/theme/Forms/FormElements.tsx"),
    route("basic-tables", "routes/theme/Tables/BasicTables.tsx"),

    route("alerts", "routes/theme/UiElements/Alerts.tsx"),
    route("avatars", "routes/theme/UiElements/Avatars.tsx"),
    route("badge", "routes/theme/UiElements/Badges.tsx"),
    route("buttons", "routes/theme/UiElements/Buttons.tsx"),
    route("images", "routes/theme/UiElements/Images.tsx"),
    route("videos", "routes/theme/UiElements/Videos.tsx"),

    route("line-chart", "routes/theme/Charts/LineChart.tsx"),
    route("bar-chart", "routes/theme/Charts/BarChart.tsx"),
  ]),

  /* 
  Páginas de autenticación de la plantilla TailAdmin
  */
  route("theme-auth", "routes/theme/AuthPages/AuthPageLayout.tsx", [
    route("sign-in", "routes/theme/AuthPages/SignIn.tsx"),
    route("sign-up", "routes/theme/AuthPages/SignUp.tsx"),
  ]),

  // Página 404
  route("*", "routes/theme/OtherPage/NotFound.tsx"),
] satisfies RouteConfig;
