import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/button';

test('hello world!', () => {
	render(<Button>Hello World</Button>);
	const buttonElement = screen.getByText(/hello world/i);
	expect(buttonElement).toBeInTheDocument();
});