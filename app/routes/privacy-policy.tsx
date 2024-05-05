export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col py-8 px-8 gap-2">
      <h1 className="font-bold text-xl">Privacy Policy</h1>
      <p>Effective Date: May 5, 2024</p>
      <p>
        This Privacy Policy describes how MyFirstPost ("we", "us", or "our")
        collects, uses, and shares information when you use our website
        myfirstinstapost.com (the "Site") and the services provided therein.
      </p>

      <h2>Information We Collect</h2>
      <p>When you use our Site, we may collect the following information:</p>
      <ul>
        <li>
          Instagram Basic Data: When you grant permission through our app, we
          collect your Instagram user ID, media count, and access token to
          facilitate the retrieval of your oldest post.
        </li>
        <li>
          Oldest Post Data: We collect data about your oldest post retrieved
          from Instagram.
        </li>
        <li>
          Session Information: We store your user ID and media count in a
          secure, HttpOnly session cookie, which expires after 30 minutes.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the collected information for the following purposes:</p>
      <ul>
        <li>
          To provide you with the service of viewing your oldest Instagram post.
        </li>
        <li>To improve and optimize our services.</li>
        <li>To prevent fraud and enhance the security of our Site.</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not share your information with third parties except in the
        following circumstances:
      </p>
      <ul>
        <li>When required by law or to protect our rights.</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We take appropriate measures to protect your information from
        unauthorized access, alteration, disclosure, or destruction. However,
        please be aware that no method of transmission over the internet or
        electronic storage is 100% secure.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can choose not to provide certain information, although it may limit
        your ability to use certain features of our Site.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at myfirstinstapost@gmail.com.
      </p>
    </div>
  );
}
