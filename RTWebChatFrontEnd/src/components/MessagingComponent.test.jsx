import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessagingComponent from './MessagingComponent';
import { MemoryRouter } from 'react-router-dom';

// Rename the render function to avoid conflicts


describe('MessagingComponent', () => {
  it('renders loading when user is not present', () => {
    window.HTMLElement.prototype.scrollIntoView = function () { };
    const { container } = render(<MessagingComponent />);
    const loadingElement = container.querySelector('div');
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.textContent).toBe('loading');
  });

  it('renders component with user', () => {
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1YzRiYjJjOGRmOWU3MzgwOGY0NWM0OSIsImlhdCI6MTcwOTc5ODM4NH0.w9VT0d3jheQk6_txq71xZdh7k7wIvF7aD5xjfb36fx0';
    const { container } = render(
      <MemoryRouter>
        <MessagingComponent user={userToken}></MessagingComponent>)
      </MemoryRouter>
    )
    const element = screen.getByText('My NavBar')
    expect(element).toBeDefined()
  });


  // Add more tests based on your specific requirements
  // For example, you can test the rendering of NavBar, MessageList, etc.


  it('sends a text message when handleSendMessage is called', async () => {
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1YzRiYjJjOGRmOWU3MzgwOGY0NWM0OSIsImlhdCI6MTcwOTc5ODM4NH0.w9VT0d3jheQk6_txq71xZdh7k7wIvF7aD5xjfb36fx0';

    render(
      <MemoryRouter>
        <MessagingComponent user={userToken}></MessagingComponent>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Type a message'), { target: { value: 'Hello, this is a test message' } });
    const sendMessageButton = screen.getByText('Send');
    fireEvent.click(sendMessageButton);
    await waitFor(() => {
      expect(screen.getByText('Hello, this is a test message'))
    });
  });

  // Add more tests as needed based on your component's functionality
});
