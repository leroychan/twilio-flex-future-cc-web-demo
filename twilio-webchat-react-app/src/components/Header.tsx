import { Box } from "@twilio-paste/core/box";
import { Text } from "@twilio-paste/core/text";
import { CloseIcon } from "@twilio-paste/icons/esm/CloseIcon";
import { Button, Flex } from "@twilio-paste/core";
import { useDispatch, useSelector } from "react-redux";

import { containerStyles, titleStyles } from "./styles/Header.styles";
import { AppState, EngagementPhase } from "../store/definitions";
import { changeEngagementPhase } from "../store/actions/genericActions";

export const Header = ({ customTitle }: { customTitle?: string }) => {
    const { conversation } = useSelector((state: AppState) => ({
        conversation: state.chat.conversation,
        conversationsClient: state.chat.conversationsClient
    }));
    const dispatch = useDispatch();

    const handleEndConversation = async () => {
        conversation?._setStatus("notParticipating", "chat");
        console.log(`User has requested to leave conversation in state`, conversation?.state);
        conversation?.leave();
        dispatch(changeEngagementPhase({ phase: EngagementPhase.PreEngagementForm }));
    };

    return (
        <Box as="header" {...containerStyles}>
            <Flex grow>
                <Flex>
                    <Text as="h2" {...titleStyles}>
                        {customTitle || "Live Chat"}
                    </Text>
                </Flex>
                <Flex hAlignContent="right" paddingRight="space30" grow>
                    <Button variant="primary_icon" size="reset" onClick={handleEndConversation}>
                        <CloseIcon decorative={false} color="colorTextIcon" size="sizeIcon20" title="End Chat" />
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};
