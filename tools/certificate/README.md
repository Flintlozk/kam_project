# Certificate Generate

1. No Need to be regenerate # using ./gencert.sh for generate certificate

2. Install Certificate Trust Root
   For Mac : `https://www.eduhk.hk/ocio/content/faq-how-add-root-certificate-mac-os-x`
   For Ubuntu :

   sudo mkdir /usr/share/ca-certificates/extra
   sudo cp localhost.crt /usr/share/ca-certificates/extra/localhost.crt
   sudo dpkg-reconfigure ca-certificates
   sudo update-ca-certificates

   For Windows : Simple MMC.msc

3. Chrome Setting Add Trust Root Authority
   Setting->Advance->Manage Certificate
   Click on Authorities --> Click Import -> Select --> RootCA.pem
