import {useEffect, useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({order, currentUser}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  });

  //Specifying the empty array [] at the bottom will only cause 
  //this to be rendered once when it first rendered on the screen
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    //The following will start the timer exactly one second into the 
    //future so to start it right away we call findTimeLeft()
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    //This function of useEffect() will only get called when we move away from this component. 
    //Otherwise it will run forever.
    return () => {
      clearInterval(timerId);
    }
  }, []);

  if(timeLeft < 0){
    return <div>Order Expired</div>
  }

  return <div> 
    Time left to pay: {timeLeft} seconds 
    <StripeCheckout 
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51HqfYYGgdxYXrX5MDBAdVKazDuH9rkJU8LRnC6gVR3LSJ3ePyuHRKLHBdr8B0Mp5SsrCAXxKyFwNb1wGAKNktdu700avGiC9hH"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
    </div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query;
  const {data} = await client.get(`/api/orders/${orderId}`);

  return {order: data};
};

export default OrderShow;
