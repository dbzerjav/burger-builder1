import React from 'react'

import Hoc from '../../hoc/Hoc';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';

const layout = (props) => (
  <Hoc>
    <Toolbar />
    <main className={classes.Content}>
      {props.children}
    </main>
  </Hoc>
);

export default layout;