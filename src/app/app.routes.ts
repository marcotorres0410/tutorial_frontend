import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/games', pathMatch: 'full'},
    { path: 'categories', loadComponent: () => import('./category/category-list/category-list').then(m => m.CategoryList)},
    { path: 'authors', loadComponent: () => import('./author/author-list/author-list').then(m => m.AuthorList)},
    { path: 'games', loadComponent: () => import('./game/game-list/game-list').then(m => m.GameList)},
    { path: 'clients', loadComponent: () => import('./client/client-list/client-list').then(m => m.ClientList)},
    { path: 'loans', loadComponent: () => import('./loan/loan-list/loan-list.page').then(m => m.LoanListPage)}
];
