import React from 'react';
import { styles } from '@/style-engine';
import { Heading, HeadingLevel } from '../typography/Heading';
import { Text } from '../typography/Text';
import { Flex } from './Flex';
import { Stack } from './Stack';
import { Group } from './Group';

const pageHeadingContainerStyles = styles({
	base: 'mb-6',
	variants: {},
	defaults: {},
});

export interface PageHeadingProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	'title'
> {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	actions?: React.ReactNode;
	level?: HeadingLevel;
}

export function PageHeading({
	title,
	subtitle,
	actions,
	level = 1,
	className = '',
	...props
}: PageHeadingProps) {
	return (
		<Flex
			as="div"
			justify="between"
			align="start"
			gap="md"
			{...pageHeadingContainerStyles.render({ className })}
			{...props}
		>
			<Stack gap="xs">
				{typeof title === 'string' ? (
					<Heading
						level={level}
						margin="none"
					>
						{title}
					</Heading>
				) : (
					title
				)}
				{subtitle &&
					(typeof subtitle === 'string' ? (
						<Text
							size="sm"
							color="accent"
						>
							{subtitle}
						</Text>
					) : (
						subtitle
					))}
			</Stack>
			{actions && (
				<Group
					gap="sm"
					align="center"
				>
					{actions}
				</Group>
			)}
		</Flex>
	);
}
