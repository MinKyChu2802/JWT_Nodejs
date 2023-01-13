import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "store";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    const router = useRouter();
    const { userInfo } = useStore();

    useEffect(() => {
      if (
        typeof window !== undefined &&
        !localStorage.getItem("accessToken") &&
        Object.is(userInfo, null)
      ) {
        router.push("/sign-in");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
