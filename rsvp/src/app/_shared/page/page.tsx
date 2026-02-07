import {Box, Container} from "@mui/material";
import { TopBar, TopBarProps } from "@/components/layout/AppBar";
import {PropsWithChildren} from "react";

type PageProps = TopBarProps &
    PropsWithChildren & {
        fullWidth?: boolean;
    };

export default function Page(props: PageProps) {
    return (
        <>
            <TopBar title={props.title} subtitle={props.subtitle} pillText={props.pillText} ctas={props.ctas}/>
            <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
                <Container
                    maxWidth={props.fullWidth ? false : "xl"}
                    disableGutters={props.fullWidth}
                    sx={{ pt: 4, px: props.fullWidth ? { xs: 2, md: 3 } : undefined }}
                >
                    {props.children}
                </Container>
            </Box>
        </>
    );
}
