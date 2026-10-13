/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{
      source: "/Azaan_Noman_Resume.pdf",
      destination: "/Azaan_Noman_General_CV.pdf",
      permanent: true,
    }];
  },
};

export default nextConfig;
