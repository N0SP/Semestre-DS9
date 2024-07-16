import { Routes } from '@angular/router';

// General routes
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { FaqComponent } from './views/faq/faq.component';
import { EditprofileComponent } from './views/editprofile/editprofile.component';
import { ContactComponent } from './views/contact/contact.component';

// Regular routes
import { HistoryComponent } from './views/history/history.component';
import { BuyComponent } from './views/buy/buy.component';
import { BoletoComponent } from './views/boleto/boleto.component';
import { Step1Component } from './views/steps/step1/step1.component';
import { Step2Component } from './views/steps/step2/step2.component';
import { Step3Component } from './views/steps/step3/step3.component';
import { Step4Component } from './views/steps/step4/step4.component';

// Admin routes
import { UsersComponent } from './views/users/users.component';
import { EventdetailComponent } from './views/eventdetail/eventdetail.component';
import { EventsComponent } from './views/events/events.component';
import { MessageComponent } from './views/message/message.component';
import { MessagesComponent } from './views/messages/messages.component';

// Promotor routes
import { PromotorComponent } from './views/promotor/promotor.component';
import { NeweventComponent } from './views/promotor/newevent/newevent.component';
import { PromoDashComponent } from './views/promotor/dashboard/promo-dash.component';

// Guards
import { authGuard, authGuard2 } from './guards/auth.guard';

export const routes: Routes = [
    
    // Principal Rutas
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    
    

    // General Rutas
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },    
    { path: 'register', component: RegisterComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'editprofile/:id', component: EditprofileComponent },
    { path: 'contact', component: ContactComponent },
    
    // Regular Rutas
    { path: 'buy/:id', component: BuyComponent },
    { path: 'history/:id', component: HistoryComponent },
    { path: 'boleto', component: BoletoComponent },
    { path: 'step1', component: Step1Component },
    { path: 'step2', component: Step2Component },
    { path: 'step3', component: Step3Component },
    { path: 'step4', component: Step4Component },
    
    // Admin Rutas
    { path: 'users', component: UsersComponent },
    { path: 'message/:id', component: MessageComponent},
    { path: 'messages', component: MessagesComponent },
    { path: 'event/:id', component: EventdetailComponent },
    { path: 'events', component: EventsComponent, canActivate: [authGuard2] },

    // Promotor Rutas
    { path: 'promotor', component: PromotorComponent },
    { path: 'promotor/newevent', component: NeweventComponent },
    { path: 'promotor/newevent/:step', component: NeweventComponent },
    { path: 'promotor/dashboard', component: PromoDashComponent },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];