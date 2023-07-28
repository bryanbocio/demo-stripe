import { Component, ElementRef, OnInit, ViewChild,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Stripe,StripeCardNumberElement,StripeCardCvcElement,StripeCardExpiryElement, loadStripe } from '@stripe/stripe-js';
import { BehaviorSubject } from 'rxjs';
import { Basket } from './Basket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private basketSource= new BehaviorSubject<Basket | null>(null);
  basketSource$= this.basketSource.asObservable();

  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef; 
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef; 
  @ViewChild('cardCvc')    cardCvcElement?: ElementRef; 

  stripe: Stripe | null= null;

  cardNumber?:StripeCardNumberElement;
  cardExpiry?:StripeCardExpiryElement;
  cardCvc?:StripeCardCvcElement;
  pubKey:string="pk_test_51NUEcGAzQjuhFyYrMyDy8wwSveZmjBiWFCx83vgQkePnR4mu4hC8UfyBsylz7enDlmYMNUAinfH1qPeV6il4Wh0500hcPSkjhL"

  title = 'demo-stripe';

  constructor(public httpClient:HttpClient){

  }

  ngOnInit(): void {
    

      loadStripe(this.pubKey).then(stripe=>{
         this.stripe= stripe;
         const elements= stripe?.elements();
         if(elements){
            this.cardNumber= elements.create('cardNumber');
            this.cardNumber.mount(this.cardNumberElement?.nativeElement);

            this.cardExpiry= elements.create('cardExpiry');
            this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);

            this.cardCvc= elements.create('cardCvc');
            this.cardCvc.mount(this.cardCvcElement?.nativeElement);
         }
         this.getBasket()
      });



    
  }
  
  
  submitPayment():void{
    const basket= this.getBasketValue();
    this.stripe?.confirmCardPayment(basket?.clientSecret!,{
      payment_method:{
        card:this.cardNumber!,
        billing_details:{
          name:"Bryan Bocio"
        }
      }
    }).then(result=>{
      console.log(result)
    })
  }


  getBasket(){
    this.httpClient.get<Basket>("https://localhost:5001/api/basket?id=40244447290").subscribe({
      next: basket=>{
        this.basketSource.next(basket);
        console.log(basket)
        localStorage.setItem('basket_id', basket.id);
      }
  })
  }
  getBasketValue(){
    return this.basketSource.value;
  }
}
