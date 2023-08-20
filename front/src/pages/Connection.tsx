import { Link } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import cuteBallsClimbingVines from '../assets/cuteBallsClimbingVines.png';

function ConnectPage() {
  const urlOAuth2 =
    'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2F' +
    window.location.hostname +
    '%3A' +
    3006 +
    '%2Foauthredirection&response_type=code';

  console.log('blabal');

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="background.default"
      style={{ backgroundColor: 'var(--background-color)', zIndex: 10 }}
    >
      <Paper
        elevation={3}
        style={{
          padding: '50px',
          borderRadius: '5px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          style={{ marginBottom: '40px' }}
        >
          Connection via
        </Typography>

        <Link to={urlOAuth2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginBottom: '15px' }}
          >
            Intra
          </Button>
        </Link>

        <Link to="/accountconnection">
          <Button variant="contained" color="secondary" fullWidth>
            Account
          </Button>
        </Link>
      </Paper>
      <img
        src={cuteBallsClimbingVines}
        alt="illustration"
        className="absolute h-2/3 l-2/3"
      />
    </Box>
  );
}

export default ConnectPage;
