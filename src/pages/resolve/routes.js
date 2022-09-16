import Home from "./pages/home/Home.vue";
import Admin from "./pages/admin/Admin.vue";
import Elections from "./pages/elections/Elections.vue";
import Cases from "./pages/cases/Cases.vue";
import CaseFile from "./pages/case-file/CaseFile.vue";

export const resolveRoutes = [
  { path: "admin", component: Admin, name: "Admin" },
  { path: "elections", component: Elections, name: "Elections" },
  { path: "cases", component: Cases, name: "Cases" },
  // todo: special name case may need to be changed
  { path: "/", component: Home, name: "Resolve" },
  {
    path: "case/:id",
    component: CaseFile,
    name: "Case",
    params: { dynamicName: true },
    props: true,
  },
];
