from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from .models import ChatHistory
from .serializers import ChatHistorySerializer,UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

class UserViewSet(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access for registration

    def get(self, request):
        """Retrieve all users (Admins only)"""
        if not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Register a new user"""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChatHistoryViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        chat_history = ChatHistory.objects.filter(user=user)
        serializer = ChatHistorySerializer(chat_history, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        message = request.data.get('message')
        if not message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the message to the database
        chat_history = ChatHistory(user=user, message=message)
        chat_history.save()

        return Response({"message": "Message sent successfully"}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        user = request.user
        ChatHistory.objects.filter(user=user).delete()
        return Response({"message": "Chat history reset successfully"}, status=status.HTTP_200_)
    



def process_message(message):
    if "hello" in message.lower():
        return "Hello! How can I assist you today?"
    else:
        return "I'm sorry, I don't understand that."

@api_view(['POST'])
def send_message(request):
    """Endpoint to send a message and get a response from the chatbot."""
    message = request.data.get('message')

    if not message:
        return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Process the message to get a response
    response = process_message(message)

    # Optionally, save the message and response to the database
    user = request.user
    chat_history = ChatHistory(user=user, message=message, response=response)
    chat_history.save()

    # Return the bot response
    return Response({"response": response})

def chatbot_response(message):
    lemmatizer = WordNetLemmatizer()

    # Load model and other data
    model = tf.keras.models.load_model('chatbot_model.h5')
    words = pickle.load(open('words.pkl', 'rb'))
    classes = pickle.load(open('classes.pkl', 'rb'))
    intents = json.loads(open('intents.json').read())

    # Preprocess the message
    def clean_up_sentence(sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
        return sentence_words

    def bag_of_words(sentence, words):
        sentence_words = clean_up_sentence(sentence)
        bag = [0] * len(words)
        for s in sentence_words:
            for i, w in enumerate(words):
                if w == s:
                    bag[i] = 1
        return np.array(bag)

    # Predict
    bow = bag_of_words(message, words)
    results = model.predict(np.array([bow]))[0]
    results_index = np.argmax(results)
    tag = classes[results_index]

    # Match intent and respond
    for intent in intents['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])

    return "I don't understand, please try again."
