import React from 'react'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {delItem} from '../redux/actions/index' 


const Cart = () =>{
    const state = useSelector ((state) => state.addItem)
    const dispatch = useDispatch()

    const cartItem = (cartItem) =>{
        return(
            <div className ="px-4 my-5 bg-light rounded-3" key ={cartItem.id}>
                <div className='container py-4'>
                    <button className='btn-close float-end' aria-lable="Close" onClick={() =>handleClose(cartItem)}></button>
                    <div className='row justify-content-center'>
                        <div className='col-md-4'>
                            <img src ={cartItem.img} alt={cartItem.title} height="200px" width="180px" />
                           </div>
                           <div className='col-md-4'>
                            <h3>{cartItem.title}</h3>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const emptyCart = () =>{
        return(
            <div className ="px-4 my-5 bg-light rounded-3">
            <div className='container py-4'>
                <div className='row'>
                    <h3>Your Cart is empty</h3>
                </div>
                </div>
                </div>

        );
    }
}
return(
    <>
    {state.length === 0 && emptyCart()}
    {state.length !== 0 && state.map(cartItem)}
    </>
)
}

export default Cart ;