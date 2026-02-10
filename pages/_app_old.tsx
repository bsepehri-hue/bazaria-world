import '../public/styles/main.css'; // Load your mythic skin

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="parchment">
      <Component {...pageProps} />
    </div>
  );
}
