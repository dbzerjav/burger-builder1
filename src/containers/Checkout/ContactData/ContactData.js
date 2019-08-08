import React, { Component } from 'react';


import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders'; 

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            zip: '',
        },
        loading: false,
    }

    orderHandler = ( event ) => {
        event.preventDefault();
        this.setState( { loading: true } );
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Mad Max',
                address: {
                    street: '1 TestStreet',
                    zip: '12345',
                },
                email: 'test@test.com',  
            },
            deliveryMethod: 'pickUp'
        }
        axios.post( '/orders.json', order )
            .then(response => {
                this.setState( { loading: false } );
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState( { loading: false } );
            });
    }

    render() {
        let form = (
            <form>
                <input 
                    className={classes.Input} 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" />
                <input 
                    className={classes.Input} 
                    type="email" 
                    name="email" 
                    placeholder="Your Email" />
                <input 
                    className={classes.Input} 
                    type="text" 
                    name="street" 
                    placeholder="Your Address" />
                <input 
                    className={classes.Input} 
                    type="text" 
                    name="zip" 
                    placeholder="Your ZipCode"/>
                <Button 
                    btnType="Success"
                    clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.address.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                { form }
            </div>
        );
    }
}

export default ContactData;