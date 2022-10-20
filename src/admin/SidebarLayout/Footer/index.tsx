import { Box, Container, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Container)(
  () => `
        margin-top: 36px;
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper admin-footer">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2022 - All rights reserved
          </Typography>
        </Box>
        {/* <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            BloomUI.com
          </Link>
        </Typography> */}
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
