import { useEffect, useState } from "react";

export function Async(): JSX.Element {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {isButtonVisible && <button>Button</button>}
      {isLoading && <span>Loading...</span>}
    </div>
  );
}
