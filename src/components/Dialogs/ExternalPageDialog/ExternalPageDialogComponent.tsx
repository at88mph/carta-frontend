import * as React from "react";
import Iframe from "react-iframe";
import {IDialogProps} from "@blueprintjs/core";
import classNames from "classnames";
import {observer} from "mobx-react";

import {DraggableDialogComponent} from "components/Dialogs";
import {AppStore, DialogId} from "stores";

import "./ExternalPageDialogComponent.scss";

@observer
export class ExternalPageDialogComponent extends React.Component {
    private static readonly DefaultWidth = 800;
    private static readonly DefaultHeight = 600;
    private static readonly MinWidth = 400;
    private static readonly MinHeight = 400;

    render() {
        const appStore = AppStore.Instance;
        const className = classNames("iframe-dialog", {"bp3-dark": appStore.darkTheme});

        const dialogProps: IDialogProps = {
            icon: "info-sign",
            className: className,
            backdropClassName: "minimal-dialog-backdrop",
            canOutsideClickClose: false,
            lazy: true,
            isOpen: appStore.dialogStore.dialogVisible.get(DialogId.ExternalPage),
            title: appStore.dialogStore.externalPageDialogTitle
        };

        return (
            <DraggableDialogComponent
                dialogProps={dialogProps}
                defaultWidth={ExternalPageDialogComponent.DefaultWidth}
                defaultHeight={ExternalPageDialogComponent.DefaultHeight}
                minWidth={ExternalPageDialogComponent.MinWidth}
                minHeight={ExternalPageDialogComponent.MinHeight}
                enableResizing={true}
                dialogId={DialogId.ExternalPage}
            >
                <div className="bp3-dialog-body">
                    <Iframe url={appStore.dialogStore.externalPageDialogUrl} />
                </div>
            </DraggableDialogComponent>
        );
    }
}
