import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import SearchBox from './SearchBox'

import { logout } from '../actions/userActions'

const Header = () => {
   const dispatch = useDispatch()

   const userLogin = useSelector((state) => state.userLogin)
   const { userInfo } = userLogin

   const logoutHandler = () => {
      dispatch(logout())
   }
   return (
      <header>
         <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
            <Container>
               <Navbar.Brand as={Link} to='/'>
                  ProShop
               </Navbar.Brand>
               <Navbar.Toggle aria-controls='basic-navbar-nav' />
               <Route
                  render={({ history }) => <SearchBox history={history} />}
               />
               <Navbar.Collapse id='basic-navbar-nav'>
                  <Nav className='ml-auto'>
                     <Nav.Link as={Link} to='/cart'>
                        <i className='fas fa-shopping-cart'></i>Cart
                     </Nav.Link>
                     {userInfo ? (
                        <NavDropdown title={userInfo.name} id='username'>
                           <NavDropdown.Item as={Link} to='/profile'>
                              Profile
                           </NavDropdown.Item>
                           <NavDropdown.Item onClick={logoutHandler}>
                              Logout
                           </NavDropdown.Item>
                        </NavDropdown>
                     ) : (
                        <Nav.Link as={Link} to='/login'>
                           <i className='fas fa-user'></i>Sign In
                        </Nav.Link>
                     )}
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
      </header>
   )
}

export default Header
