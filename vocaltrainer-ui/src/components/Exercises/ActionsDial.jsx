import * as React from 'react';
import { Stack, Tooltip, Button } from '@mui/material';

/**
 * Component that wraps buttons and their actions
 */
const ActionsDial = ({actions}) => {
  return (
    <Stack direction="row">
      {actions.map((action) => (
        <Tooltip key={action.name} title={action.name}>
          <Button onClick={action.action}>{action.icon}</Button>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default ActionsDial;