import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AsyncSelect from "react-select/async";

import Modal from "../Modal";
import { searchMembers } from "../../api";

export default function MemberSelect(props) {
  const [selectedId, setSelectedId] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  function handleChange(member) {
    setSelectedId(member.id)
  }

  async function loadOptions(query) {
    const token = await getAccessTokenSilently();
    return searchMembers(query, token);
  }

  return (
    <Modal
      title="Add a member"
      buttonLabel="Add member"
      buttonEnabled={ !!selectedId }
      onDone={() => {
        props.onSubmit(selectedId)
      }}
      onCancel={props.onCancel}
    >
      <div className="flex flex-column">
        <label htmlFor="member" className="mb2">Member</label>
        <div>
          <AsyncSelect
            onChange={handleChange}
            loadOptions={loadOptions}
            getOptionLabel={o => `${o.name} – ${o.email}`}
            getOptionValue={o => o.id}
          />
        </div>
      </div>
    </Modal>
  );
}
