import React, { Component } from 'react'
import { connect } from 'react-redux';

import Hoc from '../Hoc/Hoc';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false
  }
  
  SideDrawerClosedHandler = () => {
    this.setState( { showSideDrawer: false } );
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  }

  render() {
    return (
      <Hoc>
        <Toolbar 
          isAuth = {this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer 
          isAuth = {this.props.isAuthenticated}
          open={this.state.showSideDrawer} 
          closed={this.SideDrawerClosedHandler} />
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Hoc>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated:  state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Layout);