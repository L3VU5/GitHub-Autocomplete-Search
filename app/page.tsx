import Footer from "./components/Footer";
import GitHubSearch from "./components/GitHubSearch";
import Header from "./components/Header";
import SearchProvider from "./components/SearchProvider";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 pb-8 pt-16 sm:pt-24">
      <Header />

      <section className="mt-10 flex-1">
        <SearchProvider>
          <GitHubSearch />
        </SearchProvider>
      </section>

      <Footer />
    </main>
  );
}
