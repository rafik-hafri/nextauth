"use client"

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import BackButton from "./back-button"
import Header from "./header"
import Social from "./social"

interface CardWrapperProp {
    children: React.ReactNode
    headerlabel:string
    backButtonLabel:string
    backButtonHref: string
    showSocial?:boolean


}
function CardWrapper({children, headerlabel,backButtonLabel,showSocial,backButtonHref}:CardWrapperProp) {
  return (
    <Card className="min-w-[400px] shadow-md ">
        <CardHeader>
            <Header label={headerlabel}/>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        { showSocial && (
            <CardFooter >
                <Social/>
            </CardFooter>
        ) }
        <CardFooter>
            <BackButton label={backButtonLabel} href={backButtonHref}/>
        </CardFooter>
    </Card>
  )
}

export default CardWrapper