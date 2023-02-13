import Home from './pages/home/ResolveHome.vue';
import Admin from './pages/admin/ResolveAdmin.vue';
import Arbitrator from './pages/arbitrator/ResolveArbitrator.vue';
import Elections from './pages/elections/ResolveElections.vue';
import Cases from './pages/cases/ResolveCases.vue';
import CaseFile from './pages/case-file/CaseFile.vue';
import Account from './pages/account/ResolveAccount.vue';

export const resolveRoutes = [
    { path: 'admin', component: Admin, name: 'Admin' },
    { path: 'arbitrator', component: Arbitrator, name: 'Arbitrator' },
    { path: 'elections', component: Elections, name: 'Elections' },
    { path: 'cases', component: Cases, name: 'Cases' },
    // todo: special name case may need to be changed
    { path: '', component: Home, name: 'Resolve' },
    {
        path: 'case/:id',
        component: CaseFile,
        name: 'Case',
        params: { dynamicName: true },
        props: true
    },
    {
        path: 'account',
        component: Account,
        name: 'Account',
    }
];