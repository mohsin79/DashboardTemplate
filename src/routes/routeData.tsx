import React from 'react';
import DynamicComponent from '../components/DynamicImport'


const LazyApplication = React.lazy(() => import(`../admin/pages/Application`));
const LazyPending = React.lazy(() => import(`../admin/pages/Application/PendingApprvl`))
const LazyAccepted = React.lazy(() => import(`../admin/pages/Application/AcceptedApplication`));
const LazyRejected = React.lazy(() => import(`../admin/pages/Application/RejectedApplication`));
const LazyDraft = React.lazy(() => import(`../admin/pages/Application/DraftApplication`));
const LazyTrash = React.lazy(() => import(`../admin/pages/Application/TrashApplication`));
const LazyUserInfo = React.lazy(() => import(`../admin/pages/UserInfo`));
const LazyUserList = React.lazy(() => import(`../admin/pages/Application/UserList`));
const LazyEmailCredential = React.lazy(() => import(`../admin/pages/Setting/EmailCredential`));
const LazyRejectedEmailCredential = React.lazy(() => import(`../admin/pages/Setting/RejectedEmailCredential`));
const LazyTemplateAcceptedEmailCredential = React.lazy(() => import(`../admin/pages/Setting/AcceptedEmailCredential`));

export const adminRoutes: IRoutes<'/admin'>[] = [
    {
        route: '/admin/draft-application',
        Component: <DynamicComponent LazyComponent={LazyDraft} />
    },
    {
        route: '/admin/pending-application',
        Component: <DynamicComponent LazyComponent={LazyPending} />
    },
    {
        route: '/admin/accepted-application',
        Component: <DynamicComponent LazyComponent={LazyAccepted} />
    },
    {
        route: '/admin/rejected-application',
        Component: <DynamicComponent LazyComponent={LazyRejected} />
    },
    {
        route: '/admin/trash-application',
        Component: <DynamicComponent LazyComponent={LazyTrash} />
    },
    {
        route: '/admin/userinfo/:userId',
        Component: <DynamicComponent LazyComponent={LazyUserInfo} />
    },
    {
        route: '/admin/userlist',
        Component: <DynamicComponent LazyComponent={LazyUserList} />
    },
    {
        route: '/admin/email-credentials',
        Component: <DynamicComponent LazyComponent={LazyEmailCredential} />
    },
    {
        route: '/admin/email-template-rejected',
        Component: <DynamicComponent LazyComponent={LazyRejectedEmailCredential} />
    },
    {
        route: '/admin/email-template-accepted',
        Component: <DynamicComponent LazyComponent={LazyTemplateAcceptedEmailCredential} />
    },
    {
        route: '/admin/application',
        Component: <DynamicComponent LazyComponent={LazyApplication} />
    }
];

const LazyHome = React.lazy(() => import(`../pages/user`));


export const userRoutes: IRoutes<'/'>[] = [
    {
        route: '/home/:type/:traderId',
        Component: <DynamicComponent LazyComponent={LazyHome} />
    },
    // {
    //     route: '/register',
    //     Component: <DynamicComponent LazyComponent={LazySignUp} />
    // },

];



