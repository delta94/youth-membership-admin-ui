import React from 'react';
import { Login, useTranslate } from 'react-admin';
import { Button, Card, CardContent } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import authenticate from '../../authenticate';
import theme from '../../../common/materialUI/themeConfig';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  button: {
    marginTop: '1rem',
    width: '100%',
  },
});

const LoginPageContent: React.FC = () => {
  const classes = useStyles();
  const t = useTranslate();
  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardContent>
          <div className={classes.container}>
            <p>{t('dashboard.title')}</p>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={() => authenticate()}
            >
              {t('ra.auth.sign_in')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

const LoginPage: React.FC = () => (
  <Login>
    <LoginPageContent />
  </Login>
);

export default LoginPage;
