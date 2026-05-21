import { useRouter } from "next/router";

const Page = ({}) => {
  const router = useRouter();
  const redirectTo = "/decor";
  if (typeof window !== "undefined") {
    router.replace(redirectTo);
  }
  return null;
};

export async function getServerSideProps({}) {
  return {
    redirect: {
      permanent: false,
      destination: "/decor",
    },
  };
}

export default Page;
