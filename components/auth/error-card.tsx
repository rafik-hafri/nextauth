import { BsExclamationTriangle } from "react-icons/bs";
import CardWrapper from "./card-wrapper";

function ErrorCard() {
  return (
    <CardWrapper headerlabel="Oops! Something went wrong!" backButtonHref="/auth/login" backButtonLabel="Back to Login" >
        <div className="w-full flex justify-center items-center">
        <BsExclamationTriangle className="text-destructive"/>
        </div>
    </CardWrapper>
    
  )
}

export default ErrorCard