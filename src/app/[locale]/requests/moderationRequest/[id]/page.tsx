// Copyright (C) Siemens AG, 2024. Part of the SW360 Frontend Project.

// This program and the accompanying materials are made
// available under the terms of the Eclipse Public License 2.0
// which is available at https://www.eclipse.org/legal/epl-2.0/

// SPDX-License-Identifier: EPL-2.0
// License-Filename: LICENSE

import { Metadata } from 'next'
import ModerationRequestDetail from './components/ModerationRequestDetail'

import type { JSX } from "react";

interface Context {
    params: Promise<{ id: string }>
}

export const metadata: Metadata = {
    title: 'Requests',
}

const ModerationRequestDetailsPage = async (props: Context): Promise<JSX.Element> => {
    const params = await props.params;
    return <ModerationRequestDetail moderationRequestId={params.id} />
}

export default ModerationRequestDetailsPage
